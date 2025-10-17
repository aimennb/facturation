import { FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../components/ui/Button.js";
import { Input } from "../components/ui/Input.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.js";

interface LoginProps {
  onSuccess: () => void;
}

export const Login = ({ onSuccess }: LoginProps) => {
  const { t } = useTranslation("common");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSuccess();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-emerald-700">
            {t("login.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="email"
              >
                {t("login.email")}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="demo@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="password"
              >
                {t("login.password")}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full">
              {t("login.submit")}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            DEMO • admin@example.com / Password123!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
