import { useReducer, useState } from 'react';
import type { Card } from './types/game';
import { gameReducer, initialState } from './game/reducer';
import type { WeeklyCardAction } from './game/actions';
import type { RiskTier } from './game/helpers';
import { TradingDesk } from './components/TradingDesk';
import { UpgradeShop } from './components/UpgradeShop';
import { AppHeader } from './screens/AppHeader';
import { TitleScreen } from './screens/TitleScreen';
import { OfficeIntroScreen } from './screens/OfficeIntroScreen';
import { DailySettleScreen } from './screens/DailySettleScreen';
import { WeeklySettleScreen } from './screens/WeeklySettleScreen';
import { SqueezeWarScreen } from './screens/SqueezeWarScreen';
import { GameOverScreen, RetiredScreen, VictoryScreen } from './screens/EndScreens';
import { DebugPanel } from './screens/DebugPanel';

function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialState);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dispatch-bound callbacks (kept as plain functions so child components need no changes)
  const startGame = (risk: RiskTier) => dispatch({ type: 'START_GAME', risk });
  const enterTradingFloor = () => dispatch({ type: 'ENTER_TRADING_FLOOR' });
  const discardCard = (cardId: string) => dispatch({ type: 'DISCARD_CARD', cardId });
  const activateOtcConsumable = (otcId: string) => dispatch({ type: 'ACTIVATE_OTC', otcId });
  const redrawDiscards = () => dispatch({ type: 'REDRAW_DISCARDS' });
  const endDay = () => dispatch({ type: 'END_DAY' });
  const proceedToShop = () => dispatch({ type: 'PROCEED_TO_SHOP' });
  const buyUpgrade = (upgradeId: string) => dispatch({ type: 'BUY_UPGRADE', upgradeId });
  const buyCardDraft = (card: Card) => dispatch({ type: 'BUY_CARD_DRAFT', card });
  const liquidateCard = (cardId: string) => dispatch({ type: 'LIQUIDATE_CARD', cardId });
  const startNextDay = () => dispatch({ type: 'START_NEXT_DAY' });
  const enterWeeklySettle = () => dispatch({ type: 'ENTER_WEEKLY_SETTLE' });
  const setWeeklyCardAction = (cardId: string, action: WeeklyCardAction) =>
    dispatch({ type: 'SET_WEEKLY_CARD_ACTION', cardId, action });
  const settleWeeklyAudit = () => dispatch({ type: 'SETTLE_WEEKLY_AUDIT' });
  const initiateShortSqueezePhase = () => dispatch({ type: 'INITIATE_SHORT_SQUEEZE' });
  const retireBroker = () => dispatch({ type: 'RETIRE_BROKER' });
  const resetGame = () => dispatch({ type: 'RESET_GAME' });

  return (
    <div className="retro-terminal">
      {/* Visual CRT Scanline Overlays */}
      <div className="scanline-overlay" />

      <AppHeader state={state} onOpenDebug={() => setIsSettingsOpen(true)} />

      {/* SCREEN ROUTER */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {state.screen === 'TITLE' && <TitleScreen onStartGame={startGame} />}

        {state.screen === 'OFFICE_INTRO' && <OfficeIntroScreen onEnterTradingFloor={enterTradingFloor} />}

        {state.screen === 'DAILY_TRADE' && (
          <TradingDesk
            state={state}
            discardCard={discardCard}
            redrawDiscards={redrawDiscards}
            endDay={endDay}
            activateOtcConsumable={activateOtcConsumable}
          />
        )}

        {state.screen === 'DAILY_SETTLE' && (
          <DailySettleScreen state={state} onProceedToShop={proceedToShop} />
        )}

        {state.screen === 'WEEKLY_SHOP' && (
          <UpgradeShop
            state={state}
            buyUpgrade={buyUpgrade}
            buyCardDraft={buyCardDraft}
            liquidateCard={liquidateCard}
            startNextDay={startNextDay}
            startNextWeek={enterWeeklySettle}
            retireBroker={retireBroker}
          />
        )}

        {state.screen === 'WEEKLY_SETTLE' && (
          <WeeklySettleScreen
            state={state}
            onSetWeeklyCardAction={setWeeklyCardAction}
            onSettleWeeklyAudit={settleWeeklyAudit}
            onInitiateShortSqueeze={initiateShortSqueezePhase}
          />
        )}

        {state.screen === 'SQUEEZE_WAR' && (
          <SqueezeWarScreen state={state} onInitiateShortSqueeze={initiateShortSqueezePhase} />
        )}

        {state.screen === 'GAME_OVER' && <GameOverScreen state={state} onResetGame={resetGame} />}

        {state.screen === 'VICTORY_SHORT_SQUEEZE' && <VictoryScreen state={state} onResetGame={resetGame} />}

        {state.screen === 'RETIRED' && <RetiredScreen state={state} onResetGame={resetGame} />}
      </main>

      {/* DEBUG TERMINAL SETTINGS OVERLAY PANEL (MODAL) */}
      {isSettingsOpen && (
        <DebugPanel state={state} dispatch={dispatch} onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
}

export default App;
