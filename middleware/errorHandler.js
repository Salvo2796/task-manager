module.exports = function errorHandler(err,req,res,next) {
    console.error("Errore: " , err);
    res.status(500).json({errore: "INTERNAL SERVER ERROR"})
};