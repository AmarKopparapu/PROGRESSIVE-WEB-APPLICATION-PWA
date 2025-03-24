// app.js

// Register the Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Helper function: Convert VAPID key from base64 string to a Uint8Array
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Subscribe to Push Notifications
document.getElementById('subscribe-btn').addEventListener('click', async () => {
  // Request Notification Permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Push notifications permission not granted');
    return;
  }

  // Get Service Worker registration
  const registration = await navigator.serviceWorker.ready;
  
  // Replace with your own public VAPID key if available
  const vapidPublicKey = 'YOUR_PUBLIC_VAPID_KEY_HERE';
  const convertedVapidKey = urlB64ToUint8Array(vapidPublicKey);

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
    
    console.log('Push Subscription:', JSON.stringify(subscription));
    alert('Successfully subscribed to push notifications!');
    // Typically, you would send the subscription to your server here.
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
  }
});
