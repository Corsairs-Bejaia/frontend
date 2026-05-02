import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createApiKey, type CreateApiKeyPayload } from "@/lib/api/apiKeys"
import { Copy, Check } from "lucide-react"

interface ApiKeyFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const AVAILABLE_PERMISSIONS = [
  "verifications:read",
  "verifications:write",
]

export function ApiKeyFormModal({
  open,
  onOpenChange,
  onSuccess,
}: ApiKeyFormModalProps) {
  const [name, setName] = useState("")
  const [rateLimit, setRateLimit] = useState(100)
  const [permissions, setPermissions] = useState<string[]>([
    "verifications:read",
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rawKey, setRawKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setPermissions([...permissions, permission])
    } else {
      setPermissions(permissions.filter((p) => p !== permission))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await createApiKey({
        name,
        permissions,
        rateLimit,
      })

      if (response.success) {
        setRawKey(response.data.rawKey)
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create API key"
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (rawKey) {
      navigator.clipboard.writeText(rawKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    if (rawKey) {
      onSuccess()
      setRawKey(null)
      setName("")
      setRateLimit(100)
      setPermissions(["verifications:read"])
      onOpenChange(false)
    } else {
      onOpenChange(false)
    }
  }

  if (rawKey) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API Key Created</DialogTitle>
            <DialogDescription>
              Copy your API key now. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-surface border border-border p-4 font-mono text-sm break-all">
              {rawKey}
            </div>

            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Key
                </>
              )}
            </Button>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Create a new API key for your tenant
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key-name">Name</Label>
            <Input
              id="key-name"
              placeholder="e.g., Production Key"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="space-y-2">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div
                  key={permission}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={permission}
                    checked={permissions.includes(permission)}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={permission}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {permission}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
            <Input
              id="rate-limit"
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              min={1}
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/15 border border-destructive/30 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
