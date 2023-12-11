import { Either, error, success } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return success(10);
  } else {
    return error("error");
  }
}

test("error result", () => {
  const errorResult = doSomething(false);

  expect(errorResult.isError()).toBe(true);
  expect(errorResult.isSuccess()).toBe(false);
});

test("success result", () => {
  const successResult = doSomething(true);

  expect(successResult.isSuccess()).toBe(true);
  expect(successResult.isError()).toBe(false);
});
