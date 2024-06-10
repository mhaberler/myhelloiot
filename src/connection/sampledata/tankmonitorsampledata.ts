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

const tankmonitorsampledata = `{/* Tank monitor  example. */ }

<DashboardPage title="Tank status">


    <Card title="Tanks">

    <ViewUnit
        title="Tank1"
        className="FOOO"
        topic="ble/d82cc3c65d32"
        subconvert={JSONConvert(value => value["level"])}
        format={ProgressIconFormat({
            title: "level",
            ...Percent(),
            step: 2
        })}
    />
    <ViewUnit
        title="Tank2"
        topic="ble/f8eecc42af8d"
        subconvert={JSONConvert(value => value["level"])}
        format={ProgressIconFormat({
            title: "level",
            ...Percent(),
        })}
    />
    </Card>
    <Card title="Envelope & OAT">
        <ViewUnit
            subtopic="ble/e691df7be54d"
            subconvert={JSONConvert(value => value["tempc"])}
            format={ProgressIconFormat({
                title: "envelope temp",
                ...Celsius(),
                step: 2
            })}
        />
        <ViewUnit
            subtopic="ble/e691df7be54d"
            subconvert={JSONConvert(value => value["hum"])}
            format={ProgressIconFormat({
                title: "envelope humidity",
                ...Percent(),
                step: 2
            })}
        />
        <ViewUnit
            subtopic="ble/dd79c68fbda2"
            subconvert={JSONConvert(value => value["tempc"])}
            format={ProgressIconFormat({
                title: "OAT",
                ...Celsius(),
                step: 2
            })}
        />
        <ViewUnit
            subtopic="ble/dd79c68fbda2"
            subconvert={JSONConvert(value => value["hum"])}
            format={ProgressIconFormat({
                title: "OA humidity",
                ...Percent(),
                step: 2
            })}
        />
    </Card>

    <Card title="Sensor status">

        {/* for core2 etc with battery
        <ViewCard
            title="Battery"
            topic="system/battery"
            subconvert={JSONConvert(value => value["level"])}
            format={ProgressIconFormat({
                title: "sensorbox",
                ...Percent()
            })}
        />
        */}
        <ViewUnit
            subtopic="ble/e691df7be54d"
            subconvert={JSONConvert(value => value["batt"])}
            format={ProgressIconFormat({
                title: "envelope sensor battery",
                ...Percent(),
            })}
        />
        <ViewUnit
            subtopic="ble/dd79c68fbda2"
            subconvert={JSONConvert(value => value["batt"])}
            format={ProgressIconFormat({
                title: "OAT sensor battery",
                ...Percent(),
            })}
        />
    </Card>
    {/*  </Card> */}

</DashboardPage >



`;

export default tankmonitorsampledata;
