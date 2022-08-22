import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import moment from "moment";
export const isEmpty = (...args: string[]): boolean => {
  let push: boolean = false;
  args.every((e: string) => {
    if (!e || e.trim() === "") push = true;
    return false;
  });
  return push;
};

export const isValidUsername = (val: string): boolean => {
    const usernameRegex = /^[a-z0-9_.]+$/;
    return usernameRegex.test(val);
  };


export const comparePasswords = (password: string, hash: string): boolean => {
    return compareSync(password, hash);
  };

export const hashString = (itemToHash: string): string => {
    const salt = genSaltSync(10);
    const hash = hashSync(itemToHash, salt);
    return hash;
  };

  export const getCurrentDateInSeconds = (): number => {
    return Math.floor(Date.now() / 1000);
  };

  export const secondsToDate = (seconds: number, format?: string): string => {
    return moment.unix(seconds).format(format || "dddd MMMM Do YYYY, h:mm:ss a");
  };

  export const minutesToSeconds = (minutes: number): number => {
    return minutes * 60;
  };