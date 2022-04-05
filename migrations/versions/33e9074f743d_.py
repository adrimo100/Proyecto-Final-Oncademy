"""empty message

Revision ID: 33e9074f743d
Revises: 76dd04bd09bb
Create Date: 2022-03-23 18:51:56.913485

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '33e9074f743d'
down_revision = '76dd04bd09bb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('userSubkects',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('subject_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'subject_id')
    )
    op.drop_table('active_user')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('active_user',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('subject_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['subject_id'], ['subject.id'], name='active_user_subject_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='active_user_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='active_user_pkey')
    )
    op.drop_table('userSubkects')
    # ### end Alembic commands ###