const video = document.getElementById("video");
const channelList = document.getElementById("channelList");

let hls = null;

async function loadChannels() {

    const res = await fetch("/api/channels/list/all");
    const channels = await res.json();

    channelList.innerHTML = "";

    channels.forEach(ch => {

        channelList.innerHTML += `
            <div class="channel" onclick="playChannel(${ch.id})">

                <img src="${ch.tvg_logo || ''}" width="40">

                <span>${ch.name}</span>

            </div>
        `;

    });

}

async function playChannel(id) {

    const res = await fetch("/api/channels/" + id);
    const ch = await res.json();

    document.getElementById("title").innerHTML = ch.name;

    if (hls) {
        hls.destroy();
    }

    if (Hls.isSupported()) {

        hls = new Hls();

        hls.loadSource(ch.stream_url);

        hls.attachMedia(video);

    } else {

        video.src = ch.stream_url;

    }

}

loadChannels();