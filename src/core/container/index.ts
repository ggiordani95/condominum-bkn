import { container } from "./Container";
import { registerUserModule } from "../../modules/user/register";
import { registerAuthModule } from "../../modules/auth/register";
import { registerResidentModule } from "../../modules/resident/register";
import { registerVisitorModule } from "../../modules/visitor/register";

export function bootstrapContainer() {
  registerUserModule(container);
  registerAuthModule(container);
  registerResidentModule(container);
  registerVisitorModule(container);

  return container;
}

export { container };
