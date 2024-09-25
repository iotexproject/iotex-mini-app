import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { observer } from 'mobx-react-lite';

const ThemeSwitcher = observer(() => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <button
      type="button"
      className="py-2 transition duration-300 ease-in-out cursor-pointer"
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
    >
      {isMounted && theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
});

export default ThemeSwitcher;
