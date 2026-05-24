let ioInstance;

const init = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    // console.log('A client connected:', socket.id);
    socket.on('disconnect', () => {
      // console.log('Client disconnected:', socket.id);
    });
  });
};

const emitStockUpdate = (flowerId, newQuantity) => {
  if (ioInstance) {
    ioInstance.emit('stockUpdate', { flowerId, newQuantity });
  }
};

module.exports = init;
module.exports.emitStockUpdate = emitStockUpdate;
