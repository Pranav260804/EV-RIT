import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Server-Side Telemetry Hook
      if (user && user.email) {
        try {
          const { error } = await supabase
            .from('user_activity')
            .insert([
              {
                email: user.email,
                name: user.name,
                provider: account?.provider,
                event_type: "User Session Started",
                timestamp: new Date().toISOString()
              }
            ]);
            
          if (error) {
            console.error("Supabase Telemetry Error:", error);
          } else {
            console.log(`[TELEMETRY] Session started correctly for user: ${user.email}`);
          }
        } catch (err) {
          console.error("Telemetry System Catch:", err);
        }
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
