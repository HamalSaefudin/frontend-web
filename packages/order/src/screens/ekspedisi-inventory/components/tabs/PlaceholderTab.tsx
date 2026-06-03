import { TabsContent } from "@frontend/ui"
export function PlaceholderTab({ value }: { value: string }) {
  return (
    <TabsContent value={value} forceMount>
      <div className="py-8 text-center text-sm text-muted-foreground">
        Belum tersedia untuk fase awal.
      </div>
    </TabsContent>
  );
}

