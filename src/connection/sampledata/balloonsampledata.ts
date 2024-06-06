/*
MYHELLOIOT
Copyright (C) 2021-2023 Adrián Romero
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

const balloonsampledata = `{/* Ballooning app example. */}

<DashboardPage title="Balloon status">

<ViewCard
    title="vertical speed 0"
    topic="baro/0"
    subconvert={JSONConvert(value =>  +value["verticalSpeedKF"].toFixed(2))}
    format={DashboardIconFormat({
        title: "vertical speed",
        min: -4.0,
        max: 4.0
    })}
/>
<ViewCard
    title="vertical speed 1"
    topic="baro/1"
    subconvert={JSONConvert(value =>  +value["verticalSpeedKF"].toFixed(2))}
    format={DashboardIconFormat({
        title: "vertical speed",
        min: -4.0,
        max: 4.0
    })}
/>
<ViewCard
    title="vertical speed 2"
    topic="baro/2"
    subconvert={JSONConvert(value =>  +value["verticalSpeedKF"].toFixed(2))}
    format={DashboardIconFormat({
        title: "vertical speed",
        min: -4.0,
        max: 4.0
    })}
/>

<Card title="Altitude">
    <ViewUnit
        topic="baro/0"
        subconvert={JSONConvert(value =>  +value["altitude"].toFixed(1))}
    />
</Card>

<Card title="OAT">
    <ViewUnit
        topic="ble/c7d888f2eb44"
        subconvert={JSONConvert(value => value["tempc"])}
    />
</Card>


<ViewCard
    title="Envelope temperature"
    topic="ble/e691df7be54d"
    subconvert={JSONConvert(value => value["tempc"])}
    format={LinearIconFormat({
        title: "temperature",
        ...Celsius(),
        step: 2
    })}
/>
<ViewCard
    title="Envelope humidity"
    topic="ble/e691df7be54d"
    subconvert={JSONConvert(value => value["hum"])}
    format={LinearIconFormat({
        title: "percent",
        ...Percent(),
        step: 2
    })}
/>
<ViewCard
    title="Tank1"
    topic="ble/d82cc3c65d32"
    subconvert={JSONConvert(value => value["level"])}
    format={LinearIconFormat({
        title: "level",
        ...Percent(),
        step: 2
    })}
/>
<ViewCard
    title="Tank2"
    topic="ble/f8eecc42af8d"
    subconvert={JSONConvert(value => value["level"])}
    format={LinearIconFormat({
        title: "level",
        ...Percent(),
        step: 2
    })}
/>
</DashboardPage>


`;

export default balloonsampledata;
