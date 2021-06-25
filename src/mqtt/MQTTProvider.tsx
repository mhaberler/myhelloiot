/*
MYHELLOIOT
Copyright (C) 2021 Adrián Romero
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Context,
  useContext,
} from "react";
import mqtt, {
  MqttClient,
  IClientOptions,
  IClientSubscribeOptions,
  IClientPublishOptions,
  QoS,
} from "mqtt";
import match from "mqtt-match";

export type MQTTStatus =
  | "Disconnected"
  | "Connecting"
  | "Closed"
  | "Offline"
  | "Connected"
  | "Error"
  | "Reconnecting"
  | "Disconnecting";

export type OnlineInfo = { topic: string; qos: QoS; retain: boolean };

export type MQTTConnectInfo = {
  url: string;
  online?: OnlineInfo;
  options?: IClientOptions;
};

export type MQTTConnectionOptions = {
  protocol?: string;
  hostname?: string;
  port?: number;
  path?: string;
  protocolId?: string;
  protocolVersion?: number;
  clientId?: string;
};

export type MQTTContextValue = [
  {
    status: MQTTStatus;
    error?: Error;
    ready: boolean;
    connected: boolean;
    options: MQTTConnectionOptions;
  },
  {
    connect: ({ url, online, options }: MQTTConnectInfo) => void;
    disconnect: () => void;
    subscribe: (
      topic: string,
      callback: (topic: string, message: Buffer) => void,
      options?: IClientSubscribeOptions
    ) => SubscribeHandler | null;
    unsubscribe: (handler: SubscribeHandler | null) => void;
    publish: (
      topic: string,
      message: Buffer | string,
      options?: IClientPublishOptions
    ) => void;
  }
];

export type SubscribeHandler = {
  topic: string;
  listener: (messagetopic: string, message: Buffer) => void;
};

const MQTTContext: Context<MQTTContextValue> = createContext<MQTTContextValue>([
  {
    status: "Disconnected",
    ready: false,
    connected: false,
    options: {},
  },
  {
    connect: () => {},
    disconnect: () => {},
    subscribe: () => null,
    unsubscribe: () => {},
    publish: () => {},
  },
]);

export const useMQTTContext = () => useContext(MQTTContext);

export const useMQTTSubscribe = (
  topic: string,
  callback: (topic: string, message: Buffer) => void,
  options?: IClientSubscribeOptions
): void => {
  const [{ ready }, { subscribe, unsubscribe }] = useMQTTContext();
  useEffect(() => {
    const handler = subscribe(topic, callback, options);
    return () => {
      unsubscribe(handler);
    };
  }, [ready, topic]); // eslint-disable-line react-hooks/exhaustive-deps
};

const MQTTProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{
    status: MQTTStatus;
    error?: Error;
    client?: MqttClient;
    online?: OnlineInfo;
    _internal: {
      subscriptions: SubscribeHandler[];
      values: Map<string, Buffer>;
    };
  }>({
    status: "Disconnected",
    _internal: { subscriptions: [], values: new Map() },
  });

  const disconnect = () => {
    if (state.client && state.online) {
      state.client.publish(state.online.topic, "offline", {
        qos: state.online.qos,
        retain: state.online.retain,
      });
    }
    state.client?.end();
    state.client?.removeAllListeners();
    setState((s) => {
      s._internal.values.clear();
      return {
        status: "Disconnected",
        _internal: s._internal,
      };
    });
  };

  const connect = ({ url, online, options }: MQTTConnectInfo) => {
    disconnect();

    let connectoptions: IClientOptions = { ...options };
    if (online) {
      connectoptions = {
        ...connectoptions,
        will: {
          ...online,
          payload: "offline",
        },
      };
    }

    try {
      const client: MqttClient = mqtt.connect(url, connectoptions);
      client.on("connect", () => {
        setState((s) => {
          if (s.client && s.online) {
            s.client.publish(s.online.topic, "online", {
              qos: s.online.qos,
              retain: s.online.retain,
            });
          }

          return {
            status: "Connected",
            client: s.client,
            online: s.online,
            _internal: s._internal,
          };
        });
      });
      client.on("error", (error: Error) => {
        setState((s) => ({
          status: "Error",
          error,
          client: s.client,
          online: s.online,
          _internal: s._internal,
        }));
      });
      client.on("reconnect", () => {
        setState((s) => ({
          status: "Reconnecting",
          client: s.client,
          online: s.online,
          _internal: s._internal,
        }));
      });
      client.on("close", () => {
        setState((s) => ({
          status: "Closed",
          client: s.client,
          online: s.online,
          _internal: s._internal,
        }));
      });
      client.on("offline", () => {
        setState((s) => ({
          status: "Offline",
          client: s.client,
          online: s.online,
          _internal: s._internal,
        }));
      });
      client.on("disconnect", () => {
        setState((s) => ({
          status: "Disconnecting",
          client: s.client,
          online: s.online,
          _internal: s._internal,
        }));
      });
      client.on("message", (topic: string, message: Buffer) => {
        state._internal.subscriptions.forEach((subs) => {
          if (match(subs.topic, topic)) {
            subs.listener(topic, message);
          }
        });
        state._internal.values.set(topic, message);
      });

      setState((s) => {
        s._internal.subscriptions.length = 0;
        s._internal.values.clear();
        return {
          status: "Connecting",
          client,
          online,
          _internal: s._internal,
        };
      });
    } catch (error) {
      setState((s) => ({
        status: "Error",
        error,
        client: s.client,
        online: s.online,
        _internal: s._internal,
      }));
    }
  };

  const subscribe = (
    topic: string,
    listener: (topic: string, message: Buffer) => void,
    options?: IClientSubscribeOptions
  ): SubscribeHandler | null => {
    if (state.client && topic !== "") {
      const handler = { topic, listener };
      state._internal.subscriptions.push(handler);
      if (
        !state._internal.subscriptions.some(
          (s) => s !== handler && s.topic === topic
        )
      ) {
        state.client.subscribe(topic, options || { qos: 0 });
      }
      // in case message is retained, system will call two times the listener
      Array.from(state._internal.values.entries())
        .filter(([key]) => match(topic, key))
        .forEach(([key, value]) => listener(key, value));
      return handler;
    }
    return null;
  };

  const unsubscribe = (handler: SubscribeHandler | null) => {
    if (state.client && handler) {
      const inx: number = state._internal.subscriptions.findIndex(
        (s) => s === handler
      );
      if (inx < 0) {
        throw new Error("Not subscribed");
      }
      state._internal.subscriptions.splice(inx, 1);
      if (
        !state._internal.subscriptions.some((s) => s.topic === handler.topic)
      ) {
        state.client.unsubscribe(handler.topic);
      }
    }
  };

  const publish = (
    topic: string,
    message: Buffer | string,
    options?: IClientPublishOptions
  ) => {
    if (state.client?.connected) {
      state.client.publish(topic, message, options || {});
    } else {
      throw new Error("Not connected");
    }
  };

  const clientoptions = state.client?.options;
  const value: MQTTContextValue = [
    {
      status: state.status,
      error: state.error,
      ready: !!state.client,
      connected: state.client?.connected || false,
      options: {
        protocol: clientoptions?.protocol,
        hostname: clientoptions?.hostname,
        port: clientoptions?.port,
        path: clientoptions?.path,
        protocolId: clientoptions?.protocolId,
        protocolVersion: clientoptions?.protocolVersion,
        clientId: clientoptions?.clientId,
      },
    },
    { connect, disconnect, subscribe, unsubscribe, publish },
  ];
  return <MQTTContext.Provider value={value}>{children}</MQTTContext.Provider>;
};

export default MQTTProvider;
