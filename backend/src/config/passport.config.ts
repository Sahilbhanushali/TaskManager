import passport from "passport";
import type { Express, Request } from "express";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy, IVerifyOptions } from "passport-local";

import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import {
  loginOrCreateAccountService,
  verifyUserService,
} from "../services/auth.service";

const hasGoogleOAuthConfig =
  !!config.GOOGLE_CLIENT_ID &&
  !!config.GOOGLE_CLIENT_SECRET &&
  !!config.GOOGLE_CALLBACK_URL;

type LocalStrategyDoneFn = (
  err: Error | null,
  user?: Express.User | false,
  options?: IVerifyOptions
) => void;

type SerializeFn = (err: Error | null, user?: Express.User | false | null) => void;

if (hasGoogleOAuthConfig) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          const { email, sub: googleId, picture } = profile._json;
          console.log(profile, "profile");
          console.log(googleId, "googleId");
          if (!googleId) {
            throw new NotFoundException("Google ID (sub) is missing");
          }

          const { user } = await loginOrCreateAccountService({
            provider: ProviderEnum.GOOGLE,
            displayName: profile.displayName,
            providerId: googleId,
            picture: picture,
            email: email,
          });
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
} else {
  console.warn(
    "Google OAuth credentials are missing. Skipping Google strategy setup."
  );
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email: string, password: string, done: LocalStrategyDoneFn) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, user);
      } catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    }
  )
);

passport.serializeUser((user: Express.User, done: SerializeFn) => done(null, user));
passport.deserializeUser((user: Express.User, done: SerializeFn) => done(null, user));
