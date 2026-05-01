import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolIcon } from "../../components/SymbolIcon";
import { palette } from "../../theme/palette";
import { formatDate } from "./formatters";

interface DatePickerFieldProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function toDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getInitialMonth(value: string) {
  const parsedDate = value ? new Date(`${value}T00:00:00.000Z`) : new Date();
  return new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), 1));
}

function getMonthDays(monthDate: Date) {
  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  const leadingEmptyDays = firstDay.getUTCDay();
  const days: Array<string | null> = Array.from({ length: leadingEmptyDays }, () => null);

  for (let day = 1; day <= lastDay.getUTCDate(); day += 1) {
    days.push(toDateValue(new Date(Date.UTC(year, month, day))));
  }

  return days;
}

export function DatePickerField({ value, placeholder, onChange }: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(getInitialMonth(value));
  const days = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);
  const monthLabel = new Intl.DateTimeFormat("es-UY", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(visibleMonth);

  function shiftMonth(offset: number) {
    setVisibleMonth((current) => new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + offset, 1)));
  }

  return (
    <>
      <Pressable
        onPress={() => {
          setVisibleMonth(getInitialMonth(value));
          setVisible(true);
        }}
        style={styles.input}
      >
        <SymbolIcon symbol="▣" size={16} color={palette.textSecondary} />
        <Text style={[styles.inputText, !value && styles.placeholder]} numberOfLines={1}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <SymbolIcon symbol="⌄" size={16} color={palette.textSecondary} />
      </Pressable>

      <Modal visible={visible} animationType="fade" transparent onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.dialog} onPress={(event) => event.stopPropagation()}>
            <View style={styles.header}>
              <Pressable onPress={() => shiftMonth(-1)} style={styles.iconButton}>
                <SymbolIcon symbol="‹" size={24} color={palette.textPrimary} />
              </Pressable>
              <Text style={styles.monthLabel}>{monthLabel}</Text>
              <Pressable onPress={() => shiftMonth(1)} style={styles.iconButton}>
                <SymbolIcon symbol="›" size={24} color={palette.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {["D", "L", "M", "M", "J", "V", "S"].map((day, index) => (
                <Text key={`${day}-${index}`} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.grid}>
              {days.map((day, index) => {
                const selected = day === value;

                return (
                  <Pressable
                    key={day ?? `empty-${index}`}
                    disabled={!day}
                    onPress={() => {
                      if (day) {
                        onChange(day);
                        setVisible(false);
                      }
                    }}
                    style={[styles.dayCell, selected && styles.dayCellSelected]}
                  >
                    <Text style={[styles.dayText, selected && styles.dayTextSelected]}>
                      {day ? Number(day.slice(8, 10)) : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.footer}>
              <Pressable onPress={() => setVisible(false)} style={styles.footerButton}>
                <Text style={styles.footerButtonLabel}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onChange(toDateValue(new Date()));
                  setVisible(false);
                }}
                style={[styles.footerButton, styles.todayButton]}
              >
                <Text style={styles.todayButtonLabel}>Hoy</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E8ECE8",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: palette.textPrimary,
    fontWeight: "700",
  },
  placeholder: {
    color: palette.textSecondary,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16, 37, 26, 0.28)",
    paddingHorizontal: 18,
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: palette.surface,
    borderRadius: 26,
    padding: 16,
  },
  header: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FBF8",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: palette.textPrimary,
    textTransform: "capitalize",
  },
  weekRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  weekDay: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "800",
    color: palette.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  dayCellSelected: {
    backgroundColor: palette.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  dayTextSelected: {
    color: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  footerButton: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: palette.surfaceMuted,
  },
  footerButtonLabel: {
    color: palette.textPrimary,
    fontWeight: "800",
  },
  todayButton: {
    backgroundColor: palette.primary,
  },
  todayButtonLabel: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
