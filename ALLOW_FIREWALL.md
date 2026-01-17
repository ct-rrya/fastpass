# Allow Vite Through Windows Firewall

If your phone can't connect to http://192.168.100.47:3000, the firewall might be blocking it.

## Quick Fix:

1. **Windows Security** → **Firewall & network protection**
2. Click **"Allow an app through firewall"**
3. Click **"Change settings"**
4. Click **"Allow another app"**
5. Browse to: `C:\Program Files\nodejs\node.exe`
6. Check both **Private** and **Public** networks
7. Click **OK**

## Or Temporarily Disable (Not Recommended):

1. **Windows Security** → **Firewall & network protection**
2. Click your active network
3. Turn **Windows Defender Firewall** to **Off**
4. Test on phone
5. **Turn it back on** when done!

## Test Connection:

On your phone, open browser and go to:
```
http://192.168.100.47:3000
```

You should see EnrollFlow!
