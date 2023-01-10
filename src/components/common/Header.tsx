import { setIsAuthDialogOpen, setIsLoggedIn } from "@redux/actions/authActions";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/common/Header.module.css";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import logo from "public/logo.png";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthDialogType } from "src/types/auth";
import AuthDialog from "../auth/authDialog";

const Header = () => {
  const { data: session } = useSession();
  const isLoggedIn = useSelector(AuthSelectors.getIsLoggedIn);
  const dispatch = useDispatch();

  const mobileMenuItems = [
    {
      label: "Login",
      command: () => {
        openAuthDialog(AuthDialogType.CUSTOMER);
      },
    },
    {
      label: "Are you a shop?",
      command: () => {
        openAuthDialog(AuthDialogType.SHOP);
      },
    },
  ];

  const mobileMenuItemsLoggedIn = [
    {
      label: "Logout",
      command: () => {
        signOut();
      },
    },
  ];

  // Set global isLoggedIn state based on user session
  useEffect(() => {
    if (!isLoggedIn && session?.user != null) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }));
    } else if (isLoggedIn && session?.user == null) {
      dispatch(setIsLoggedIn({ isLoggedIn: false }));
    }
  }, [session?.user, isLoggedIn, dispatch]);

  /**
   * Handle navbar button clicks to open auth dialog
   */
  const openAuthDialog = (type: AuthDialogType) => {
    dispatch(
      setIsAuthDialogOpen({ isAuthDialogOpen: true, authDialogType: type })
    );
  };

  const start = (
    <Image
      src={logo}
      alt="Sayyara Logo"
      height={logo.height * 0.75}
      width={logo.width * 0.75}
    />
  );

  const end = !isLoggedIn ? (
    <div>
      <Button
        label="Login"
        className={classNames(styles.loginBtn, "blueText")}
        onClick={() => openAuthDialog(AuthDialogType.CUSTOMER)}
      />
      <Button
        label="Are you a shop?"
        className={styles.shopLoginBtn}
        onClick={() => openAuthDialog(AuthDialogType.SHOP)}
      />
    </div>
  ) : (
    <div>
      <Button
        label="Logout"
        className={classNames(styles.loginBtn, "blueText")}
        onClick={() => signOut()}
      />
    </div>
  );

  return (
    <div>
      {/* Desktop Nav Bar */}
      <Menubar
        className={classNames(styles.menuBar, styles.desktop)}
        start={start}
        end={end}
      />
      {/* Mobile Nav Bar */}
      {!isLoggedIn ? (
        <Menubar
          className={classNames(styles.menuBar, styles.mobile)}
          start={start}
          model={mobileMenuItems}
        />
      ) : (
        <Menubar
          className={classNames(styles.menuBar, styles.mobile)}
          start={start}
          model={mobileMenuItemsLoggedIn}
        />
      )}

      <AuthDialog />
    </div>
  );
};

export default React.memo(Header);
