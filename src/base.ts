import {Environment, Logger} from "coge-environment";
import * as fs from "./utils/fs";
import * as user from "./utils/user";
import isPlainObject from "@tiopkg/utils/is/plainObject";

export interface BaseTemplateOptions extends Record<string, any> {
  env?: Environment | Record<string, any>;
}

export class BaseTemplate {
  opts;
  env: Environment;
  logger: Logger;

  fs = fs;
  user = user;

  constructor(opts?: BaseTemplateOptions) {
    this.opts = opts || {};
    this.env = this.opts.env;

    if (!this.env) {
      this.env =  Environment.createEnv();
    } else if (isPlainObject(this.env)) {
      const env = Environment.createEnv();
      Object.assign(env, this.env);
      this.env = env;
    } else {
      Environment.enforceUpdate(this.env);
    }

    this.logger = this.env?.adapter?.logger;
  }

  log(msg: any, ...args: any[]) {
    return this.logger.log(msg, ...args);
  }
}
