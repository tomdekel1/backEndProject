function configError(message) {
  throw new Error(message);
}

module.exports = {
  jwtKey:
    process.env.JWT_KEY ??
    configError("enviroment variable JWT_KEY is missing"),
};
