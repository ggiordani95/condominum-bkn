import { container } from "./Container";
import { registerUserModule } from "../../modules/user/register";
import { registerAuthModule } from "../../modules/auth/register";
import { registerVisitorModule } from "../../modules/visitor/register";

export function bootstrapContainer() {
  registerUserModule(container);
  registerAuthModule(container);
  registerVisitorModule(container);

  return container;
}

export { container };
