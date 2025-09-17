import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import pool from "../db";

const signUid = (value: object) => {
  return jwt.sign({ value }, process.env.JWTSECRET || "secret", {
    expiresIn: "8h", // expires in 8 hours
  });
};
const signUidMobile = (value: object) => {
  return jwt.sign({ value }, process.env.JWTSECRET || "secret", {
    expiresIn: "30d", // expires in 7 days
  });
};
const verifyUid = async (token: string): Promise<any> =>
  new Promise((resolve) => {
    const jwtToken = token.split(" ")[1] || token;
    jwt.verify(jwtToken, process.env.JWTSECRET || "secret", (err, decoded) => {
      if (err) {
        console.log("error verifyUid", err);
        resolve(null);
      } else {
        resolve(decoded);
      }
    });
  });

const authorize = (roles: string[]) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.length) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.headers.authorization) {
      const token = await verifyUid(req.headers.authorization);
      if (!token) {
        return res.status(401).json({ message: "Session Expired" });
      }

      // const result = await pool.query(
      //   'select * from "highonbuzzSchema".users where id=$1',
      //   [token.value.id]
      // );

      // const user = result?.rows[0];

      // if (!user) {
      //   return res.status(401).json({ message: "No User Found" });
      // }

      // const hasAccess = roles.find((role) => role === user.role);

      // if (!hasAccess) {
      //   return res.status(403).json({ message: "Forbbiden" });
      // }

      // // Delete sensitive information before sending the data object
      // delete user.password;

      // (req as any).user = user;
      next();
    }
  };
};

export { authorize, signUid, verifyUid, signUidMobile };
