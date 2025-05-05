let currentAudioBlob = null;

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  }
}

async function generateVoice() {
  const text = document.getElementById("textInput").value.trim();
  const voice = document.getElementById("voiceSelect").value;
  const format = document.getElementById("formatSelect").value;
  const audioPlayer = document.getElementById("audioPlayer");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!text) {
    showToast("Please enter some text.");
    return;
  }

  try {
    const response = await fetch("/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice, format })
    });

    const data = await response.json();

    if (data.audioUrl) {
      audioPlayer.src = data.audioUrl;
      audioPlayer.play();
      currentAudioBlob = data.audioUrl;
      downloadBtn.disabled = false;
      showToast("Voice generated successfully!");
    } else {
      showToast("Failed to generate voice.");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("An error occurred while generating the voice.");
  }
}

function downloadAudio() {
  if (!currentAudioBlob) return;

  const link = document.createElement("a");
  link.href = currentAudioBlob;
  link.download = `generated_audio.${document.getElementById("formatSelect").value}`;
  link.click();
}
