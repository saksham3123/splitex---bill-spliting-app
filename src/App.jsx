import { useState, useEffect } from 'react';
import { useBillStore } from './hooks/useBillStore';
import { useCalculator } from './hooks/useCalculator';
import { AppHeader } from './components/AppHeader';
import { GroupsDashboard } from './components/GroupsDashboard';
import { StepPeople } from './components/StepPeople';
import { StepItems } from './components/StepItems';
import { StepTip } from './components/StepTip';
import { StepSummary } from './components/StepSummary';
import { Footer } from './components/Footer';
import { useToast, ToastContainer } from './components/Toast';
import './App.css';

export default function App() {
  const [step, setStep] = useState(1);
  const { state, avatarColors, actions } = useBillStore();
  const { toasts, addToast } = useToast();

  // ── Theme management ───────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('splitex-theme') || 'dark'; }
    catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('splitex-theme', theme); } catch { /* */ }
  }, [theme]);

  // ── Active group ───────────────────────────────────────────
  const activeGroup = state.groups.find(g => g.id === state.activeGroupId) ?? null;
  const billState   = activeGroup ?? { people: [], items: [], tip: 18, tax: 0, currency: 'USD' };

  const { calculations, formatAmount, getPersonById, getPersonColor, getPersonInitials } =
    useCalculator(billState, avatarColors);

  const goTo = (s) => setStep(s);

  const handleOpenGroup = (id) => { actions.setActiveGroup(id); setStep(1); };
  const handleBackToDashboard = () => { actions.backToDashboard(); setStep(1); };
  const handleReset = () => {
    actions.resetGroup();
    setStep(1);
    addToast('Group cleared! Starting fresh.', 'info');
  };

  // ── Dashboard view ─────────────────────────────────────────
  if (!state.activeGroupId) {
    return (
      <>
        <GroupsDashboard
          groups={state.groups}
          avatarColors={avatarColors}
          onOpenGroup={handleOpenGroup}
          onCreateGroup={actions.createGroup}
          onDeleteGroup={actions.deleteGroup}
          addToast={addToast}
          theme={theme}
          onThemeChange={setTheme}
        />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  // ── Bill-flow view ──────────────────────────────────────────
  return (
    <div className="app-wrapper">
      <AppHeader
        currentStep={step}
        onStepClick={goTo}
        peopleCount={billState.people.length}
        itemsCount={billState.items.length}
        activeGroup={activeGroup}
        onBack={handleBackToDashboard}
        theme={theme}
        onThemeChange={setTheme}
      />

      {step === 1 && (
        <StepPeople
          people={billState.people}
          avatarColors={avatarColors}
          onAddPerson={actions.addPerson}
          onRemovePerson={actions.removePerson}
          onNext={() => goTo(2)}
          addToast={addToast}
        />
      )}
      {step === 2 && (
        <StepItems
          items={billState.items}
          people={billState.people}
          avatarColors={avatarColors}
          onAddItem={actions.addItem}
          onUpdateItem={actions.updateItem}
          onRemoveItem={actions.removeItem}
          onNext={() => goTo(3)}
          onBack={() => goTo(1)}
          addToast={addToast}
          currency={billState.currency}
        />
      )}
      {step === 3 && (
        <StepTip
          tip={billState.tip}
          tax={billState.tax}
          currency={billState.currency}
          subtotal={billState.items.reduce((s, i) => s + i.amount, 0)}
          onSetTip={actions.setTip}
          onSetTax={actions.setTax}
          onSetCurrency={actions.setCurrency}
          onNext={() => goTo(4)}
          onBack={() => goTo(2)}
          formatAmount={formatAmount}
        />
      )}
      {step === 4 && (
        <StepSummary
          people={billState.people}
          items={billState.items}
          calculations={calculations}
          tip={billState.tip}
          tax={billState.tax}
          currency={billState.currency}
          avatarColors={avatarColors}
          onBack={() => goTo(3)}
          onReset={handleReset}
          formatAmount={formatAmount}
          getPersonById={getPersonById}
          getPersonColor={getPersonColor}
          getPersonInitials={getPersonInitials}
        />
      )}

      <Footer />
      <ToastContainer toasts={toasts} />
    </div>
  );
}
