from datetime import datetime

from pydantic import BaseModel


class AlertNotificationResponse(BaseModel):
	id: str
	type: str
	severity: str
	title: str
	device_name: str | None = None
	device_code: str | None = None
	description: str | None = None
	unread: bool
	created_at: datetime

	class Config:
		from_attributes = True
