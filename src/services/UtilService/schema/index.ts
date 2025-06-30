import Joi from "joi";
import { OTP_EVENT } from "../../../common";

const otpSchema = Joi.object({
  otp: Joi.string()
    .regex(/^\d{1,6}$/)
    .required(),
  otpType: Joi.string()
    .valid(
      OTP_EVENT.VERIFY_EMAIL,
      OTP_EVENT.VERIFY_PHONE,
      OTP_EVENT.FORGOT_PASSWORD
    )
    .min(3),
    otp_resent: Joi.boolean(),
});

const resendOTPSchema = Joi.object({
  otpType: Joi.string()
    .valid(
      OTP_EVENT.VERIFY_EMAIL,
      OTP_EVENT.VERIFY_PHONE,
      OTP_EVENT.FORGOT_PASSWORD
    )
    .min(3),
  otp_resent: Joi.boolean(),
});

export { otpSchema, resendOTPSchema };
