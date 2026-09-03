import { AIInspectionProvider } from './AIProvider';
import { DemoAIProvider } from './DemoAIProvider';
import { RealVisionAIProvider } from './RealVisionAIProvider';

export function getAIProvider(useDemoMode = true): AIInspectionProvider {
  if (useDemoMode) {
    return new DemoAIProvider();
  }
  const realProvider = new RealVisionAIProvider();
  if (!realProvider.isConfigured()) {
    return new DemoAIProvider();
  }
  return realProvider;
}
