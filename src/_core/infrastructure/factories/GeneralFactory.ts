import { AuthController } from '../http/controllers/AuthController';
import { ExcelUserRepository } from '../persistence/spreadsheet/repositories/ExcelUserRepository';
import { LoginUseCase } from '../../application/auth/LoginUseCase';
import { GasHashingService } from '../services/gas/GasHashingService';
import { GasAuthService } from '../services/gas/GasAuthService';
import { RegisterUseCase } from '../../application/auth/RegisterUseCase';
import { ValidatorService } from '../../domain/services/validations/ValidatorService';
import { LogoutUseCase } from '../../application/auth/LogoutUseCase';
import { GoogleLoginUseCase } from '../../application/auth/GoogleLoginUseCase';
import { GasHttpClient } from '../services/gas/GasHttpClient';
import { GasMailEmitter } from '../services/gas/GasMailEmitter';
import { GoogleJwtValidator } from '../../domain/services/GoogleJwtValidator';
import { UserService } from '../../domain/services/entityservices/UserService';
import { RoleService } from '../../domain/services/entityservices/RoleService';
import { ExcelRoleRepository } from '../persistence/spreadsheet/repositories/ExcelRoleRepository';
import { ExcelRoleUserRepository } from '../persistence/spreadsheet/repositories/ExcelRoleUserRepository';
import { UserController } from '../http/controllers/UserController';
import { ListUsersUseCase } from '../../application/user/ListUsersUseCase';
import { InviteUserUseCase } from '../../application/user/InviteUserUseCase';
import { UsersEmailService } from '../../domain/services/email/UsersEmailService';
import { ModifyUserRolesUseCase } from '../../application/user/ModifyUserRolesUseCase';
import { EventBase } from '../../domain/services/queues/EventBase';
import { EventProcessor } from '../../domain/services/queues/EventProcessor';

export interface Entrypoints {
  // Core
  AuthController: AuthController;
  UserController: UserController;

  processors: {
    [x: string]: EventProcessor<EventBase>;
  };
}

export class GeneralFactory {

  public mountEntrypoints(): Entrypoints {
    // Repositories
    const userRepository = new ExcelUserRepository();
    const roleRepository = new ExcelRoleRepository();
    const roleUserRepository = new ExcelRoleUserRepository();

    // Services
    // const requestValidator = new RequestValidator();
    // const stringHelper = new StringHelper();
    // const templateEngine = new TemplateEngine(stringHelper);
    const mailEmitter = new GasMailEmitter();
    const hashingService = new GasHashingService();
    const authService = new GasAuthService();
    const validatorService = new ValidatorService();
    const userEmailService = new UsersEmailService(mailEmitter);
    const httpClient = new GasHttpClient();
    // const base64Encoder = new GasBase64Encoder();
    const googleJwtValidator = new GoogleJwtValidator(httpClient);
    // const calendarService = new GasCalendarService();

    // Entity Services
    const userService = new UserService(userRepository);
    const roleService = new RoleService(roleRepository, roleUserRepository);

    // Event Producer
    // const eventProducer = new DatabaseEventProducer();

    // UseCases
    const loginUseCase = new LoginUseCase(userRepository, hashingService, authService, roleService);
    const googleLoginUseCase = new GoogleLoginUseCase(
      userRepository,
      authService,
      googleJwtValidator,
      userService,
      roleService,
    );
    const logoutUseCase = new LogoutUseCase(userRepository);
    const registerUseCase = new RegisterUseCase(userRepository, validatorService, hashingService);
    const listUsersUseCase = new ListUsersUseCase(userRepository, roleService);
    const inviteUserUseCase = new InviteUserUseCase(validatorService, userRepository, userService, userEmailService);
    const modifyUserRolesUseCase = new ModifyUserRolesUseCase(userRepository, roleRepository, roleUserRepository);

    return {
      // ------------------------------------------------------------------------------------------------------
      // --------------------------------------------  CONTROLLERS --------------------------------------------
      // ------------------------------------------------------------------------------------------------------
      AuthController: new AuthController(loginUseCase, registerUseCase, logoutUseCase, googleLoginUseCase),
      UserController: new UserController(
        listUsersUseCase,
        inviteUserUseCase,
        modifyUserRolesUseCase,
      ),
      // ------------------------------------------------------------------------------------------------------
      // --------------------------------------------  PROCESSORS  --------------------------------------------
      // ------------------------------------------------------------------------------------------------------
      processors: {},
    };
  }
}
