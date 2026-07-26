import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // استثناء لوحة التحكم وواجهات API والملفات الثابتة من توجيه اللغات
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
