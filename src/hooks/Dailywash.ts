import { useState, useEffect } from 'react';
import { getDailyWear } from '../api/wears';      
import { updateWashStatus } from '../api/closet'; 

export const useDailyWash = () => {
  const [isWashModalOpen, setIsWashModalOpen] = useState(false);
  const [todayClothIds, setTodayClothIds] = useState<number[]>([]);

  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info",
    onConfirm: () => {}
  });

  const showAlert = (message: string, type: "success" | "error" | "info" = "info", onConfirm?: () => void) => {
    setAlertState({ 
        isOpen: true, 
        message, 
        type, 
        onConfirm: onConfirm || (() => setAlertState(prev => ({ ...prev, isOpen: false })))
    });
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  };

  const triggerWashPrompt = async (isAuto = false) => {
    try {
      const todayString = getTodayString();

      if (isAuto) {
        const lastWashDate = localStorage.getItem('lastWashCompleteDate');
        if (lastWashDate === todayString) return;
      }

      const response = await getDailyWear(todayString);

      if (response && response.data && response.data.clothIds?.length > 0) {
        setTodayClothIds(response.data.clothIds);
        setIsWashModalOpen(true);
      } else {
        if (!isAuto) showAlert("오늘 캘린더에 등록된 의상이 없습니다.", "info");
      }
    } catch (error) {
      console.error("착용 기록 조회 실패:", error);
    }
  };

  useEffect(() => {
    const checkTimeAndTrigger = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 22) {
        triggerWashPrompt(true);
      }
    };
    
    checkTimeAndTrigger();
    const interval = setInterval(checkTimeAndTrigger, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handleConfirmWash = async () => {
    try {
      await updateWashStatus(todayClothIds, "WASHING");
      showAlert("오늘 입은 옷들을 세탁 바구니로 보냈습니다!", "success");
      setIsWashModalOpen(false);

      localStorage.setItem('lastWashCompleteDate', getTodayString());

    } catch (error) {
      console.error("세탁 상태 변경 실패:", error);
      showAlert("오류가 발생했습니다.", "error");
    }
  };

  const handleCancelWash = () => {
    setIsWashModalOpen(false);
  };

  return {
    isWashModalOpen,
    alertState,
    triggerWashPrompt,
    handleConfirmWash,
    handleCancelWash
  };
};

export default useDailyWash;