import { container } from "./Container";
import { registerUserModule } from "../../modules/user/register";
import { registerAuthModule } from "../../modules/auth/register";

export function bootstrapContainer() {
  registerUserModule(container);
  registerAuthModule(container);

  return container;
}

export { container };
