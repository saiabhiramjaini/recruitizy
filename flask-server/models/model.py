from sqlalchemy import Column, Text, Integer, JSON, Table
from .db import Base

class CandidateProfile(Base):
    __tablename__ = 'Candidate'

    id = Column(Integer, primary_key=True)  # Primary key added
    firstName = Column(Text)
    lastName = Column(Text)
    email = Column(Text, unique=True, index=True)
    resume = Column(Text)
    status = Column(Text)
    aiAnalysis = Column(JSON)
    aiMailResponse = Column(JSON)
    jobId = Column(Integer)


class JobDescription(Base):
    __tablename__ = 'Job'

    id = Column(Integer, primary_key=True)  # Primary key added
    title = Column(Text)
    description = Column(Text)
    role = Column(Text)
    threshold = Column(Integer)
    jdSummary = Column(Text)
    companyId = Column(Integer)

class Company(Base):
    __tablename__ = 'Company'

    id = Column(Integer, primary_key=True)  # Primary key added
    name = Column(Text)