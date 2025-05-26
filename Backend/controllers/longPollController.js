let waitingClients = [];

function addClient(res) {
  const timeout = setTimeout(() => {
    res.json({ chat: false, notification: false, sos: false });
    waitingClients = waitingClients.filter(c => c.res !== res);
  }, 30000);

  waitingClients.push({ res, timeout });

  res.req.on("close", () => {
    clearTimeout(timeout);
    waitingClients = waitingClients.filter(c => c.res !== res);
  });
}

function notifyClients(...eventTypes) {
  waitingClients.forEach(({ res, timeout }) => {
    clearTimeout(timeout);

    const payload = {
      chat: false,
      notification: false,
      sos: false,
    };

    eventTypes.forEach((type) => {
      if (type in payload) {
        payload[type] = true;
      }
    });

    res.json(payload);
  });

  waitingClients = [];
}

module.exports = { addClient, notifyClients };