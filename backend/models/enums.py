import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    user = "user"

class DeviceStatus(str, enum.Enum):
    online = "online"
    offline = "offline"
    maintenance = "maintenance"

class AlertSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"