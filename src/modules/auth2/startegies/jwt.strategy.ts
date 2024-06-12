// import { Injectable, Logger } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ConfigManager } from "../../../config";
// import { ExtractJwt, Strategy } from "passport-jwt";

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   private readonly logger = new Logger(JwtStrategy.name);

//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: ConfigManager.config.JWT_PRIVATE_KEY,
//     });
//   }

//   async validate(payload: any) {
//     console.log(payload, 's');
    
//     this.logger.log(`Validating payload: ${JSON.stringify(payload)}`);
//     return { user_id: payload.user_id,  roles: payload.roles };
//   }

//   async authenticate(...args: any[]) {
//     // this.logger.log(`Authenticated user: ${JSON.stringify(args)}`);
//     const validatedUser = super.authenticate(args[0]);
//     this.logger.log(`Authenticated user: ${JSON.stringify(validatedUser)}`);
//     return validatedUser;
//   }
// }