async function loadChannels() {
    try {
        const res = await fetch("/api/channels");
        const channels = await res.json();

        const tbody = document.getElementById("channelsBody");

        tbody.innerHTML = "";

        channels.forEach(ch => {
            tbody.innerHTML += `
                <tr>
                    <td>${ch.name || ""}</td>
                    <td>${ch.group_title || ""}</td>
                    <td>${ch.country || ""}</td>
                    <td>${ch.language || ""}</td>
                    <td>
                        ${ch.tvg_logo
                            ? `<img src="${ch.tvg_logo}" width="40">`
                            : ""}
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        alert("Failed to load channels");
    }
}

loadChannels();