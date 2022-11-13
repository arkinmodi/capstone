import authStyles from "../../styles/pages/auth/Auth.module.css";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  FormGroup,
  Icon,
  InputGroup,
} from "@blueprintjs/core";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import AuthTypes from "../../redux/types/authTypes";

interface ILoginFormValues {
  csrfToken: "";
  email: string;
  password: string;
}

const initialLoginFormValues: ILoginFormValues = {
  csrfToken: "",
  email: "",
  password: "",
};

const Login: NextPage = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [formValues, setFormValues] = useState<ILoginFormValues>({
    ...initialLoginFormValues,
    csrfToken,
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignUpButtonClick = () => {
    const href = {
      pathname: "/auth/register",
      query: { callbackUrl: router.query.callbackUrl },
    };
    router.push(href);
  };

  const handleLoginButtonClick = (): void => {
    // TODO: validate inputs
    dispatch({ type: AuthTypes.CREATE_LOGIN, payload: formValues });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <div className={authStyles.authContainer}>
      <Card
        className={authStyles.authFormCard}
        interactive={false}
        elevation={Elevation.THREE}
      >
        <div className={authStyles.authFormCardHeader}>
          <Icon icon="user" size={80} />
          <h1>Login</h1>
        </div>
        <div className={authStyles.authForm}>
          <FormGroup
            label="Email"
            labelFor="authLoginFormEmailInput"
            labelInfo="(Required)"
          >
            <InputGroup
              id="authLoginFormEmailInput"
              placeholder="Email"
              className={authStyles.authFormInput}
              value={formValues.email}
              onChange={handleInputChange}
              name="email"
            />
          </FormGroup>
          <FormGroup
            label="Password"
            labelFor="authLoginFormPasswordInput"
            labelInfo="(Required)"
          >
            <InputGroup
              id="authLoginFormPasswordInput"
              type="password"
              placeholder="Password"
              className={authStyles.authFormInput}
              value={formValues.password}
              onChange={handleInputChange}
              name="password"
            />
          </FormGroup>
          <ButtonGroup className={authStyles.authFormButtonGroup}>
            <Button
              intent="primary"
              className={authStyles.authFormButton}
              onClick={handleLoginButtonClick}
            >
              Login
            </Button>
            <Button
              intent="primary"
              className={authStyles.authFormButton}
              minimal
              onClick={handleSignUpButtonClick}
            >
              Sign Up
            </Button>
          </ButtonGroup>
        </div>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const callbackUrl = context.query.callbackUrl;
  const session = await getServerAuthSession(context);

  if (session && !Array.isArray(callbackUrl)) {
    return {
      redirect: {
        destination: callbackUrl ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default Login;
