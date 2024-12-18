const createScheduleTable = async (element) => {
    const SchedSettings = {
        "periodNames": {}
    }

    fetch("https://croomssched.tech/sched/defaultSettings.json").then((res) => {
        return res.json();
    }).then((Settings) => {
        const SavedSettings = JSON.parse(localStorage.getItem("settings"));
        Object.assign(SavedSettings, Settings);
        Object.assign(SchedSettings, Settings);
    }).catch((e) => {
        console.error(e);
    });

    const request = await fetch("https://api.croomssched.tech/today");
    const response = (await request.json()).data;

    const scheduleTable = document.createElement("table");
    const tableHeader = document.createElement("thead");
    scheduleTable.appendChild(tableHeader);
    tableHeader.innerHTML = `<tr><th colspan="3">`+ response.msg +`</th></tr>`;
    const tableBody = document.createElement("tbody");
    scheduleTable.appendChild(tableBody);
    element.appendChild(scheduleTable);

    const getDefaultLunch = () => {
        if (SchedSettings.defaultLunch === "A Lunch") return 0;
        else return 1;
    }

    const c24to12 = (hour, minute) => {
        let apm;
        if (hour === 0) {hour = 12; apm = "AM";}
        else if (hour < 12) apm = "AM";
        else if (hour === 12) apm = "PM";
        else if (hour > 12) {hour -= 12; apm = "PM";}

        if (minute < 10) minute = "0" + minute;

        return hour + ":" + minute + " " + apm;
    }

    const buildTable = (tblBody) => {
        tblBody.innerText = "";
        const schedule = response.schedule[defaultLunch];

        function getEventName(EventName) {
            if (EventName === 1 || EventName === 2 || EventName === 3 || EventName === 4 || EventName === 5
                || EventName === 6 || EventName === 7) {
                EventName = SchedSettings.periodNames[EventName];
            } else if (EventName === 0) {
                EventName = "Nothing";
            } else if (EventName === 100) {
                EventName = "Morning";
            } else if (EventName === 101) {
                EventName = "Welcome";
            } else if (EventName === 102) {
                EventName = "Lunch";
            } else if (EventName === 103) {
                EventName = "Homeroom";
            } else if (EventName === 104) {
                EventName = "Dismissal";
            } else if (EventName === 105) {
                EventName = "After School";
            } else if (EventName === 106) {
                EventName = "End";
            } else if (EventName === 107) {
                EventName = "Break";
            } else if (EventName === 110) {
                EventName = "PSAT/SAT";
            } else {
                EventName = "Unknown Event";
            }

            if (EventName === undefined) {
                EventName = "Unknown Event";
            }

            return EventName;
        }

        schedule.forEach((event, index) => {
            event[2] = getEventName(event[2]).toString();

            const tableRow = document.createElement("tr");
            const startTime = c24to12(event[0], event[1]);
            const endTime = c24to12(event[3], event[4]);

            tableRow.innerHTML = `<td>`+ startTime +`</td><td>`+ event[2] +`</td><td>`+ endTime +`</td>`;
            tableBody.appendChild(tableRow);
        });
    }

    let defaultLunch = getDefaultLunch();
    buildTable(tableBody);
}