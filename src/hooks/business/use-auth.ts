import { computed } from 'vue';
import { isArray } from 'lodash-es';
import { useAuthStore } from '@/store/modules/auth';
export default function useAuth(permission?: Auth.PermissionType) {
  const authStore = useAuthStore();
  function hasPermission(permissions: string[] | string) {
    if (isArray(permissions)) {
      return permissions.some(x => authStore.grantedPolicies[x]);
    }
    return authStore.grantedPolicies[permissions];
  }
  const hasCreate = computed(() => {
    return hasPermission(`${permission}.Create`);
  });
  const hasUpdate = computed(() => {
    return hasPermission(`${permission}.Update`);
  });
  const hasDelete = computed(() => {
    return hasPermission(`${permission}.Delete`);
  });
  const hasGet = computed(() => {
    return hasPermission(`${permission}`);
  });
  return {
    hasPermission,
    hasCreate,
    hasUpdate,
    hasDelete,
    hasGet
  };
}
