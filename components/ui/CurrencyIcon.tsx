import { iconForCurrency } from "@/lib/i18n/currency-icon";
import { Icon, type IconProps } from "./Icon";

export type CurrencyIconProps = Omit<IconProps, "name"> & {
  currency?: string | null;
};

export function CurrencyIcon({ currency, ...props }: CurrencyIconProps) {
  return <Icon name={iconForCurrency(currency)} {...props} />;
}
