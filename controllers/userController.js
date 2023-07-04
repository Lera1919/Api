exports.avatar = async (req, res) => {

  console.log(req.file);

return res.status(200).json({"message":  "Файл получен"});
}