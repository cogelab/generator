import {InstallMixin} from "./mixins/install";
import {BaseTemplate, BaseTemplateOptions} from "./base";
import {SpawnMixin} from "./mixins/spawn";

export interface Prompter<Q, T> {
  prompt: (questions: Q) => Promise<T>
}

export interface PromptOptions {
  prompter: Prompter<any, any>;
  context: Record<string, any>;
}

export interface Templating {
  questions?: Record<string, any>[];
  params?: (opts: PromptOptions) => Promise<any>;
  prompt?: (opts: PromptOptions) => Promise<any>;
  locals?: (locals: Record<string, any>) => Promise<Record<string, any> | undefined>;
  filter?: (files: string[], locals: Record<string, any>) => Promise<string[]>;
  install?: () => Promise<void>;
  end?: () => Promise<void>;
}

export interface TemplateOptions extends BaseTemplateOptions {
}

export class Template extends InstallMixin(SpawnMixin(BaseTemplate)) implements Templating {
  opts: TemplateOptions;

  constructor(opts?: TemplateOptions) {
    super(opts);
  }

  async prompt(opts: PromptOptions): Promise<any> {
    return;
  }

  async locals(locals: Record<string, any>): Promise<Record<string, any> | undefined> {
    return locals;
  }

  async filter(files: string[], locals: Record<string, any>): Promise<string[]> {
    return files;
  }

  async install(): Promise<void> {
    return;
  }

  async end(): Promise<void> {
    return;
  }

}
