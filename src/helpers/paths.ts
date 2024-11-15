const paths = {
  home() {
    return "./";
  },
  signIn() {
    //will revalidate
    return "./signin";
  },
  LogIn() {
    //will revalidate
    return "./login";
  },
  passwordReset() {
    //will revalidate
    return "./passwordreset";
  },
  write() {
    //will revalidate
    return "./write";
  },
  blogPost() {
    return "./blogPost";
  },
  categoryName(categorySlug: string) {
    return `/${categorySlug}`;
  },
};

export default paths;
