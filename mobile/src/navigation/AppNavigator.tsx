import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CategoriesScreen } from "../screens/CategoriesScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ExpenseDetailScreen } from "../screens/ExpenseDetailScreen";
import { ExpensesScreen } from "../screens/ExpensesScreen";
import { ScreenPlaceholder } from "../components/ScreenPlaceholder";
import { palette } from "../theme/palette";
import { SymbolIcon } from "../components/SymbolIcon";

const Tab = createBottomTabNavigator();
const ExpensesStack = createNativeStackNavigator();

function ExpensesNavigator() {
  return (
    <ExpensesStack.Navigator screenOptions={{ headerShown: false }}>
      <ExpensesStack.Screen name="Dashboard" component={DashboardScreen} />
      <ExpensesStack.Screen name="ExpensesList" component={ExpensesScreen} />
      <ExpensesStack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />
    </ExpensesStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarStyle: {
          height: 76,
          paddingTop: 10,
          paddingBottom: 12,
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: "⌂",
            Categories: "▦",
            Reports: "◔",
            Profile: "◯",
          } as const;

          return (
            <SymbolIcon symbol={iconMap[route.name as keyof typeof iconMap]} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={ExpensesNavigator} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen
        name="Reports"
        children={() => (
          <ScreenPlaceholder
            title="Reportes pendientes"
            description="La navegación ya contempla el crecimiento de ExpenTra sin mezclarlo con el alcance actual."
            icon="◔"
          />
        )}
      />
      <Tab.Screen
        name="Profile"
        children={() => (
          <ScreenPlaceholder
            title="Perfil pendiente"
            description="La relación con usuario ya existe en backend, aunque todavía operamos con un usuario implícito."
            icon="◯"
          />
        )}
      />
    </Tab.Navigator>
  );
}
