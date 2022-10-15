import { VAPID_PUBLIC_KEY, url } from "./env.js";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

const suscription = async () => {
  //Service Worker
  const register = navigator.serviceWorker.register("/worker.js", {
    scope: "/",
  });
  console.log("New service worker");

  const dataSuscription = (await register).pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const body = {
    dataSuscription: await dataSuscription,
    title: "Titulo",
    message: "mensaje",
  };

  await fetch(url + "/subscribe", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Suscribed");
};

suscription();

/*document.addEventListener('click', async () => {
  await fetch(url + '/notification', {
    method: 'POST',
    body: {
      title: 'Estación 1',
      message: 'Estación en peligro.'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
});*/
