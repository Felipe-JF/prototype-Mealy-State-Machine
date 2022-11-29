class Done<T, E> {
  constructor(private done: T) {
  }
}
class Fail<T, E> {
  constructor(private fail: E) {
  }
}

type Result<T, E> = Done<T, E> | Fail<T, E>;

const Result = {
  done<T, E>(done: T) {
    return new Done<T, E>(done);
  },
  fail<T, E>(fail: E) {
    return new Fail<T, E>(fail);
  },
};

class Initial {}

class Idle {}

class Pending {}

class Fuffiled {
  constructor(
    readonly result: Result<{
      token: string;
    }, {
      reason: string;
    }>,
  ) {
  }
}

type Model = Initial | Idle | Pending | Fuffiled;

const Model = {
  Fuffiled(result: Result<{ token: string }, { reason: string }>) {
    return new Fuffiled(result);
  },
  Idle() {
    return new Idle();
  },
  Initial() {
    return new Initial();
  },
  Pending() {
    return new Pending();
  },
  isIdle(model: Model): model is Idle {
    return model instanceof Idle;
  },
};

type Update<T> = (model: T) => Model;

type Action<T> = (model: T) => {
  model: T;
  effect?: (abort: AbortSignal) => Promise<Action<T>>;
};

type Effect<T> = {
  action: Action<T>;
  close: () => void;
};

const Action = {
  Login(crendentials: { cpf: string; senha: string }): Action<Model> {
    return (model) => {
      if (!Model.isIdle(model)) return ({ model });

      return ({
        model: Model.Pending(),
        effect: async (abort): Promise<Action<Model>> => {
          //Passando crendenciais e retornando a api
          const token = await Promise.resolve("Fake-Authorization-Token");

          return (model) => {
            if (model instanceof Pending) return { model };

            return { model: Model.Fuffiled(Result.done({ token })) };
          };
        },
      });
    };
  },
};

async function* teste(): AsyncGenerator<number, void, string> {
  const result = yield 1;
  yield 2;
  yield 3;
}

async function main() {
  const generator = teste();
  const result = await generator.next();
  console.log(result.value);
  {
    const result = await generator.next();
    console.log(result.value);
    {
      const result = await generator.next();
      console.log(result.value);
    }
  }
}
main();
