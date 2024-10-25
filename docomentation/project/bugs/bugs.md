## Bugs

**Project needs to run in the WSL unless it is unbearable slow**

**at least Ubuntu-20 needs for VSCode, below are not supported**

**needs to install a lot of VSCode extension again for WSL**

`async session({ session, user }: any) {
      if (session && user) {
        session.user.id = user.id; // Add user ID to session
      }
      return session;
    },`

**It is might be a bug , auth might not working without it**

`async signIn({ user, account }: any): Promise<any> {

          if (response.status === 201) {
            return true; // If response is okay, allow sign-in
          }
        } catch (error) {
          console.error(error); // Log the error properly
        }

....
return true; // Always return true to avoid access denied`
