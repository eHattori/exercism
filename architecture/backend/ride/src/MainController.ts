import GetAccount from "./GetAccount";
import HttpServer from "./HttpServer";
import Signup from "./Signup";

export default class MainController {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount
  ) {
    httpServer.on("post", "/signup", async (params: any, body: any) => {
      const output = await signup.execute(body);
      return output;
    });

    httpServer.on("get", "/accounts/:accountId", async (params: any) => {
      const output = await getAccount.execute(params.accountId);
      return output;
    });
  }
}
