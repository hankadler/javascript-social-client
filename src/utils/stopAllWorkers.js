const stopAllWorkers = async () => {
  const maxId = window.setTimeout(() => {
    for (let i = maxId; i >= 0; i -= 1) window.clearInterval(i);
  }, 0);
};

export default stopAllWorkers;
