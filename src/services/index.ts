import { IProductRepository, ICategoryRepository, IRFQRepository, ISettingsRepository } from '../repositories/base';
import { MockProductRepository, MockCategoryRepository, MockRFQRepository, MockSettingsRepository } from '../repositories/mock';
import { SupabaseProductRepository, SupabaseCategoryRepository, SupabaseRFQRepository, SupabaseSettingsRepository } from '../repositories/supabase';
import { isSupabaseConfigured } from '../lib/supabase';

// Auto-detect: use Supabase repository when configured, otherwise fallback to mock data
function createServiceContainer() {
  if (isSupabaseConfigured) {
    return {
      productRepository: new SupabaseProductRepository() as IProductRepository,
      categoryRepository: new SupabaseCategoryRepository() as ICategoryRepository,
      rfqRepository: new SupabaseRFQRepository() as IRFQRepository,
      settingsRepository: new SupabaseSettingsRepository() as ISettingsRepository,
    };
  }

  return {
    productRepository: new MockProductRepository() as IProductRepository,
    categoryRepository: new MockCategoryRepository() as ICategoryRepository,
    rfqRepository: new MockRFQRepository() as IRFQRepository,
    settingsRepository: new MockSettingsRepository() as ISettingsRepository,
  };
}

export const services = createServiceContainer();
