import { Provider } from "@loopback/context";
import { HttpErrors } from "@loopback/rest";
import { AzureAdSignUpFn } from "@sourceloop/authentication-service";

export class AzureAdSignupProvider implements Provider<AzureAdSignUpFn> {
    value(): AzureAdSignUpFn {
      // sonarignore:start 
      return async profile => {
        // sonarignore:end

        console.log(profile);
        throw new HttpErrors.NotImplemented(
          `AzureAdSignupProvider not implemented`,
        );
      };
    }
  }