"""empty message

Revision ID: 6533c8d770c8
Revises: 
Create Date: 2022-04-01 14:34:50.562712

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '10f3cda0c765'
down_revision = "232ee97f591b"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('course',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('invitation_code',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('code', sa.String(length=155), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('code')
    )
    op.create_table('role',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('subject',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('cardDescription', sa.String(length=200), nullable=False),
    sa.Column('image_url', sa.String(), nullable=False),
    sa.Column('start_date', sa.DateTime(), nullable=True),
    sa.Column('end_date', sa.DateTime(), nullable=True),
    sa.Column('course_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['course_id'], ['course.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('full_name', sa.String(length=70), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('userSubjects',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('subject_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'subject_id')
    )
    op.create_table('tags',
    sa.Column('payment_id', sa.Integer(), nullable=False),
    sa.Column('subject_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['payment_id'], ['payment.id'], ),
    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], ),
    sa.PrimaryKeyConstraint('payment_id', 'subject_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('tags')
    op.drop_table('userSubjects')
    op.drop_table('payment')
    op.drop_table('user')
    op.drop_table('subject')
    op.drop_table('role')
    op.drop_table('invitation_code')
    op.drop_table('course')
    # ### end Alembic commands ###
